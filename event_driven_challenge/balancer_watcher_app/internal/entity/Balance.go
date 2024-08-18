package entity

import (
	"time"

	uuid "github.com/google/uuid"
)

type Balance struct {
	ID        string
	AcctID    string
	Balance   float64
	CreatedAt time.Time
}

func NewBalance(acctId string, balance float64) *Balance {
	return &Balance{
		ID:        uuid.New().String(),
		AcctID:    acctId,
		Balance:   balance,
		CreatedAt: time.Now(),
	}
}
