package find_account

import (
	"testing"

	"github.com/hugaleno/balancer_watcher/internal/entity"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type BalanceGatewayMock struct {
	mock.Mock
}

func (m *BalanceGatewayMock) Save(balance *entity.Balance) error {
	args := m.Called(balance)
	return args.Error(0)
}

func (m *BalanceGatewayMock) FindByAcctID(accountId string) (*entity.Balance, error) {
	args := m.Called(accountId)
	return args.Get(0).(*entity.Balance), args.Error(1)
}

func (m *BalanceGatewayMock) FindById(id string) (*entity.Balance, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Balance), args.Error(1)
}

func (m *BalanceGatewayMock) Update(balance *entity.Balance) error {
	args := m.Called(balance)
	return args.Error(0)
}

func TestFindAccountUseCase_Execute(t *testing.T) {
	balance := entity.NewBalance("0000-1111-2222-3333", 50.0)
	accountMock := &BalanceGatewayMock{}
	accountMock.On("FindByAcctID", balance.AcctID).Return(balance, nil)

	uc := NewFindAccountUseCase(accountMock)
	inputDto := FindAccountInputDTO{
		AcctID: balance.AcctID,
	}
	output, err := uc.Execute(inputDto)
	assert.Nil(t, err)
	assert.Equal(t, balance.ID, output.ID)
	assert.Equal(t, balance.AcctID, output.AcctID)
	assert.Equal(t, balance.Balance, output.Balance)
}
