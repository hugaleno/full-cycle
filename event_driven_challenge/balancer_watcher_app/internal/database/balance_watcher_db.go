package database

import (
	"database/sql"
	"fmt"

	"github.com/hugaleno/balancer_watcher/internal/entity"
)

type BalanceWatcherDB struct {
	DB *sql.DB
}

func NewBalanceWatcherDB(db *sql.DB) *BalanceWatcherDB {
	return &BalanceWatcherDB{
		DB: db,
	}
}

func (bw *BalanceWatcherDB) FindByAcctID(acctID string) (*entity.Balance, error) {
	var balance entity.Balance
	fmt.Println("Before prepare ", acctID)
	stmt, err := bw.DB.Prepare("select * from balance where acct_id=? order by created_at desc limit 1")
	if err != nil {
		return nil, err
	}

	defer stmt.Close()
	row := stmt.QueryRow(acctID)
	fmt.Println("Before prepare ", row)
	err = row.Scan(
		&balance.ID,
		&balance.AcctID,
		&balance.Balance,
		&balance.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &balance, nil
}

func (bw *BalanceWatcherDB) FindById(balanceId string) (*entity.Balance, error) {
	var balance entity.Balance

	stmt, err := bw.DB.Prepare("select * from balance where id=?")
	if err != nil {
		return nil, err
	}

	defer stmt.Close()
	row := stmt.QueryRow(balanceId)
	err = row.Scan(
		&balance.ID,
		&balance.AcctID,
		&balance.Balance,
		&balance.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &balance, nil
}

func (b *BalanceWatcherDB) Save(balance *entity.Balance) error {
	stmt, err := b.DB.Prepare("INSERT INTO balance (id, acct_id, balance, created_at) VALUES (?, ?, ?, ?)")
	fmt.Println("Before Save ", balance)
	if err != nil {
		fmt.Println("Erro preparing statemente ", err.Error())
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(balance.ID, balance.AcctID, balance.Balance, balance.CreatedAt)
	if err != nil {
		fmt.Println("Erro executing statement ", err.Error())
		return err
	}
	return nil
}

func (b *BalanceWatcherDB) Update(balance *entity.Balance) error {
	stmt, err := b.DB.Prepare("UPDATE balance SET balance = ? WHERE id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(balance.Balance, balance.ID)
	if err != nil {
		return err
	}
	return nil
}
