package web_balance

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/hugaleno/balancer_watcher/internal/usecases/find_account"
)

type WebBalanceController struct {
	FindAccountUseCase find_account.FindAccountUseCase
}

func NewWebBalanceController(findAccountUseCase find_account.FindAccountUseCase) *WebBalanceController {
	return &WebBalanceController{
		FindAccountUseCase: findAccountUseCase,
	}
}

func (wbc *WebBalanceController) FindAccount(response http.ResponseWriter, request *http.Request) {
	acctId := chi.URLParam(request, "account_id")
	fmt.Println("Request ID received", acctId)
	account, err := wbc.FindAccountUseCase.Execute(find_account.FindAccountInputDTO{AcctID: acctId})
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(err.Error()))
		return
	}
	accountJson, err := json.Marshal(account)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(err.Error()))
		return
	}
	fmt.Fprint(response, string(accountJson))
}
