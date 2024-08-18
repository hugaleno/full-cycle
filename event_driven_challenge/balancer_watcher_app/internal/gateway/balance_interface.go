package gateway

import "github.com/hugaleno/balancer_watcher/internal/entity"

type BalanceGateway interface {
	Save(balance *entity.Balance) error
	FindById(balanceId string) (*entity.Balance, error)
	FindByAcctID(acctId string) (*entity.Balance, error)
	Update(balance *entity.Balance) error
}
