package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/go-sql-driver/mysql"
	"github.com/hugaleno/balancer_watcher/internal/database"
	"github.com/hugaleno/balancer_watcher/internal/usecases/create_balance"
	"github.com/hugaleno/balancer_watcher/internal/usecases/find_account"
	web_balance "github.com/hugaleno/balancer_watcher/internal/web/controllers/balance"
	"github.com/hugaleno/balancer_watcher/internal/web/webserver"
)

type BalanceEvent struct {
	Name    string      `json:"Name"`
	Payload BalanceData `json:"Payload"`
}

type BalanceData struct {
	AccountIDFrom      string  `json:"account_id_from"`
	AccountIDTo        string  `json:"account_id_to"`
	BalanceAccountFrom float64 `json:"balance_account_id_from"`
	BalanceAccountTo   float64 `json:"balance_account_id_to"`
}

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "mysql-for-balancer_watcher", "3306", "balance"))
	if err != nil {
		panic(err)
	}
	defer db.Close()
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS balance (id varchar(255), acct_id varchar(255), balance integer, created_at timestamp)")
	if err != nil {
		panic(err)
	}
	_, err = db.Exec("INSERT INTO balance (id, acct_id, balance, created_at) VALUES ('77070722-5d9b-11ef-9aef-9f4bdac32bd9', '7c4e3778-5d9b-11ef-ba18-ab2226a6c0d6', 5000, now())")
	if err != nil {
		panic(err)
	}
	_, err = db.Exec("INSERT INTO balance (id, acct_id, balance, created_at) VALUES ('82805608-5d9b-11ef-a9ad-1352c655c3c4', '87ff7fb4-5d9b-11ef-ab97-9381530d6432', 100, now())")
	if err != nil {
		panic(err)
	}

	balanceWatcherDb := database.NewBalanceWatcherDB(db)

	createBalanceUseCase := create_balance.NewCreateBalanceUseCase(balanceWatcherDb)
	findAccountUseCase := find_account.NewFindAccountUseCase(balanceWatcherDb)

	go func() {
		webserver := webserver.NewWebServer(":8080")
		balancerController := web_balance.NewWebBalanceController(*findAccountUseCase)
		webserver.AddHandler("/accounts/{account_id}", balancerController.FindAccount)
		fmt.Println("Server running at port 8080")
		webserver.Start()
	}()

	configMap := &kafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"client.id":         "balances",
		"group.id":          "balances",
		"auto.offset.reset": "earliest",
	}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	a, err := kafka.NewAdminClient(&kafka.ConfigMap{"bootstrap.servers": "kafka:29092"})
	if err != nil {
		fmt.Printf("Failed to create Admin client: %s\n", err)
	}
	maxDur, err := time.ParseDuration("60s")
	if err != nil {
		panic("ParseDuration(60s)")
	}
	_, err = a.CreateTopics(
		ctx,
		// Multiple topics can be created simultaneously
		// by providing more TopicSpecification structs here.
		[]kafka.TopicSpecification{{
			Topic:             "balances",
			NumPartitions:     1,
			ReplicationFactor: 1}},
		// Admin options
		kafka.SetAdminOperationTimeout(maxDur))
	if err != nil {
		fmt.Printf("Failed to create topic: %v\n", err)
	}
	c, err := kafka.NewConsumer(configMap)
	if err != nil {
		fmt.Println("failed to initiate consumer", err.Error())
		panic("failed to initiate consumer")
	}
	topics := []string{"balances"}
	c.SubscribeTopics(topics, nil)

	for {
		msg, err := c.ReadMessage(-1)
		if err == nil {
			fmt.Println(string(msg.Value), msg.TopicPartition)

			var event BalanceEvent
			if err := json.Unmarshal(msg.Value, &event); err != nil {
				fmt.Println("Failed to parse JSON:", err)
				continue
			}
			fmt.Println("event.Payload.AccountIDFrom:", event.Payload.AccountIDFrom)
			fmt.Println("event.Payload.BalanceAccountFrom:", event.Payload.BalanceAccountFrom)
			fmt.Println("event.Payload.AccountIDTo:", event.Payload.AccountIDTo)
			fmt.Println("event.Payload.BalanceAccountTo:", event.Payload.BalanceAccountTo)
			input := create_balance.CreateBalanceInputDTO{
				AcctID:  event.Payload.AccountIDFrom,
				Balance: event.Payload.BalanceAccountFrom,
			}
			_, err = createBalanceUseCase.Execute(input)
			if err != nil {
				fmt.Println("Error saving ", event.Payload.AccountIDFrom, err.Error())
			}

			input = create_balance.CreateBalanceInputDTO{
				AcctID:  event.Payload.AccountIDTo,
				Balance: event.Payload.BalanceAccountTo,
			}
			_, err = createBalanceUseCase.Execute(input)
			if err != nil {
				fmt.Println("Error saving ", event.Payload.AccountIDTo, err.Error())
			}
		}
		c.CommitMessage(msg)
	}
}
