package find_account

import (
	"fmt"

	"github.com/hugaleno/balancer_watcher/internal/gateway"
)

type FindAccountInputDTO struct {
	AcctID string `json:"account_id"`
}

type FindAccountOutputDTO struct {
	ID      string  `json:"id"`
	AcctID  string  `json:"account_id"`
	Balance float64 `json:"balance"`
}

type FindAccountUseCase struct {
	BalanceGateway gateway.BalanceGateway
}

func NewFindAccountUseCase(bg gateway.BalanceGateway) *FindAccountUseCase {
	return &FindAccountUseCase{
		BalanceGateway: bg,
	}
}

func (uc *FindAccountUseCase) Execute(input FindAccountInputDTO) (*FindAccountOutputDTO, error) {
	fmt.Println(input.AcctID)
	balance, err := uc.BalanceGateway.FindByAcctID(input.AcctID)
	if err != nil {
		return nil, err
	}

	return &FindAccountOutputDTO{
		ID:      balance.ID,
		AcctID:  balance.AcctID,
		Balance: balance.Balance,
	}, nil
}
