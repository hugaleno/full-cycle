package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBalanceConstructor(t *testing.T) {
	new_balance := NewBalance("0000-1111-2222-3333", 50.00)
	assert.NotNil(t, new_balance)
	assert.Equal(t, "0000-1111-2222-3333", new_balance.AcctID)
	assert.Equal(t, 50.00, new_balance.Balance)
}
