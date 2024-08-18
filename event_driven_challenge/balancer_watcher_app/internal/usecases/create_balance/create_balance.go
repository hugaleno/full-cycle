package create_balance

import (
	"time"

	"github.com/hugaleno/balancer_watcher/internal/entity"
	"github.com/hugaleno/balancer_watcher/internal/gateway"
)

type CreateBalanceInputDTO struct {
	AcctID  string  `json:"acct_id"`
	Balance float64 `json:"balance"`
}

type CreateBalanceOutputDTO struct {
	ID        string    `json:"id"`
	AcctID    string    `json:"acct_id"`
	Balance   float64   `json:"balance"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateBalanceUseCase struct {
	BalanceGateway gateway.BalanceGateway
}

func NewCreateBalanceUseCase(bg gateway.BalanceGateway) *CreateBalanceUseCase {
	return &CreateBalanceUseCase{
		BalanceGateway: bg,
	}
}

func (uc *CreateBalanceUseCase) Execute(input CreateBalanceInputDTO) (*CreateBalanceOutputDTO, error) {
	balance := entity.NewBalance(input.AcctID, input.Balance)

	err := uc.BalanceGateway.Save(balance)
	if err != nil {
		return nil, err
	}

	return &CreateBalanceOutputDTO{
		ID:        balance.ID,
		AcctID:    balance.AcctID,
		Balance:   balance.Balance,
		CreatedAt: balance.CreatedAt,
	}, nil
}
