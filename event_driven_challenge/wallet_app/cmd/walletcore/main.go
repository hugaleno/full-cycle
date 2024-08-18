package main

import (
	"context"
	"database/sql"
	"fmt"

	"github.com.br/devfullcycle/fc-ms-wallet/internal/database"
	"github.com.br/devfullcycle/fc-ms-wallet/internal/event"
	"github.com.br/devfullcycle/fc-ms-wallet/internal/event/handler"
	createaccount "github.com.br/devfullcycle/fc-ms-wallet/internal/usecase/create_account"
	"github.com.br/devfullcycle/fc-ms-wallet/internal/usecase/create_client"
	"github.com.br/devfullcycle/fc-ms-wallet/internal/usecase/create_transaction"
	"github.com.br/devfullcycle/fc-ms-wallet/internal/web"
	"github.com.br/devfullcycle/fc-ms-wallet/internal/web/webserver"
	"github.com.br/devfullcycle/fc-ms-wallet/pkg/events"
	"github.com.br/devfullcycle/fc-ms-wallet/pkg/kafka"
	"github.com.br/devfullcycle/fc-ms-wallet/pkg/uow"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "mysql-for-wallet", "3306", "wallet"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS clients (id varchar(255), name varchar(255), email varchar(255), created_at date)")
	if err != nil {
		panic(err)
	}
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS accounts (id varchar(255), client_id varchar(255), balance integer, created_at date)")
	if err != nil {
		panic(err)
	}
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS transactions (id varchar(255), account_id_from varchar(255), account_id_to varchar(255), amount integer, created_at date)")
	if err != nil {
		panic(err)
	}
	_, err = db.Exec("INSERT INTO clients (id, name, email, created_at) VALUES ('dec67682-5db3-11ef-af79-5b142451abc9', 'Joaquim Nabuco', 'joaquim@email.com', '2024-08-18'), ('cddad4ee-5db3-11ef-a74f-b3fddbf95ea5', 'Maria', 'maria@email.com', '2024-08-18'), ('0aa28e44-5db4-11ef-be95-9312dd5e80f8', 'Ana', 'ana@email.com', '2024-08-18')")
	if err != nil {
		panic(err)
	}
	_, err = db.Exec("INSERT INTO accounts (id, client_id, balance, created_at) VALUES ('2f5d1dbc-5db4-11ef-9b7a-ffa8fd9f968a', 'dec67682-5db3-11ef-af79-5b142451abc9', 2000, '2024-08-18'), ('4d745766-5db4-11ef-b9df-0f52f277bb04', 'cddad4ee-5db3-11ef-a74f-b3fddbf95ea5', 2000, '2024-08-18'), ('664867be-5db4-11ef-a864-cf1dc0230fc2', '0aa28e44-5db4-11ef-be95-9312dd5e80f8', 2000, '2024-08-18')")
	if err != nil {
		panic(err)
	}
	_, err = db.Exec("INSERT INTO transactions (id, account_id_from, account_id_to, amount, created_at) VALUES (UUID(), '2f5d1dbc-5db4-11ef-9b7a-ffa8fd9f968a', '4d745766-5db4-11ef-b9df-0f52f277bb04', 200, '2024-08-18'), (UUID(), '664867be-5db4-11ef-a864-cf1dc0230fc2', '2f5d1dbc-5db4-11ef-9b7a-ffa8fd9f968a', 600, '2024-08-18')")
	if err != nil {
		panic(err)
	}

	configMap := ckafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "wallet",
	}
	kafkaProducer := kafka.NewKafkaProducer(&configMap)

	eventDispatcher := events.NewEventDispatcher()
	eventDispatcher.Register("TransactionCreated", handler.NewTransactionCreatedKafkaHandler(kafkaProducer))
	eventDispatcher.Register("BalanceUpdated", handler.NewUpdateBalanceKafkaHandler(kafkaProducer))
	transactionCreatedEvent := event.NewTransactionCreated()
	balanceUpdatedEvent := event.NewBalanceUpdated()

	clientDb := database.NewClientDB(db)
	accountDb := database.NewAccountDB(db)

	ctx := context.Background()
	uow := uow.NewUow(ctx, db)

	uow.Register("AccountDB", func(tx *sql.Tx) interface{} {
		return database.NewAccountDB(db)
	})

	uow.Register("TransactionDB", func(tx *sql.Tx) interface{} {
		return database.NewTransactionDB(db)
	})
	createTransactionUseCase := create_transaction.NewCreateTransactionUseCase(uow, eventDispatcher, transactionCreatedEvent, balanceUpdatedEvent)
	createClientUseCase := create_client.NewCreateClientUseCase(clientDb)
	createAccountUseCase := createaccount.NewCreateAccountUseCase(accountDb, clientDb)

	webserver := webserver.NewWebServer(":8080")

	clientHandler := web.NewWebClientHandler(*createClientUseCase)
	accountHandler := web.NewWebAccountHandler(*createAccountUseCase)
	transactionHandler := web.NewWebTransactionHandler(*createTransactionUseCase)

	webserver.AddHandler("/clients", clientHandler.CreateClient)
	webserver.AddHandler("/accounts", accountHandler.CreateAccount)
	webserver.AddHandler("/transactions", transactionHandler.CreateTransaction)

	fmt.Println("Server is running")
	webserver.Start()
}
