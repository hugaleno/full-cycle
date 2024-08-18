package create_balance

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

func TestCreateBalanceUseCase_Execute(t *testing.T) {
	balanceMock := &BalanceGatewayMock{}
	balanceMock.On("Save", mock.Anything).Return(nil)

	uc := NewCreateBalanceUseCase(balanceMock)
	inputDto := CreateBalanceInputDTO{
		AcctID:  "0000-1111-2222-3333",
		Balance: 50.00,
	}
	output, err := uc.Execute(inputDto)
	assert.Nil(t, err)
	assert.NotNil(t, output.ID)
	// asssert valid uuid
	balanceMock.AssertExpectations(t)
	balanceMock.AssertNumberOfCalls(t, "Save", 1)
}
