package usecase

import (
	"encoding/json"
	"time"

	"github.com/pedrorougemont/codebank/domain"
	"github.com/pedrorougemont/codebank/dto"
	"github.com/pedrorougemont/codebank/infrastructure/kafka"
)

type UseCaseTransaction struct {
	TransactionRepository domain.TransactionRepository
	KafkaProducer         kafka.KafkaProducer
}

func NewUseCaseTransaction(transactionRepository domain.TransactionRepository) UseCaseTransaction {
	return UseCaseTransaction{TransactionRepository: transactionRepository}
}

func (u UseCaseTransaction) ProcessTransaction(transactionDto dto.Transaction) (domain.Transaction, error) {
	creditCard := domain.NewCreditCard()
	creditCard.Name = transactionDto.Name
	creditCard.Number = transactionDto.Number
	creditCard.ExpirationMonth = transactionDto.ExpirationMonth
	creditCard.ExpirationYear = transactionDto.ExpirationYear
	creditCard.CVV = transactionDto.CVV
	ccBalanceAndLimit, err := u.TransactionRepository.GetCreditCard(*creditCard)

	if err != nil {
		return domain.Transaction{}, err
	}

	creditCard.ID = ccBalanceAndLimit.ID
	creditCard.Limit = ccBalanceAndLimit.Limit
	creditCard.Balance = ccBalanceAndLimit.Balance

	t := domain.NewTransaction()
	t.CreditCardId = creditCard.ID
	t.Amount = transactionDto.Amount
	t.Store = transactionDto.Store
	t.Description = transactionDto.Description
	t.CreatedAt = time.Now()

	t.ProcessAndValidate(creditCard)
	err = u.TransactionRepository.SaveTransaction(*t, *creditCard)

	if err != nil {
		return domain.Transaction{}, err
	}

	transactionDto.ID = t.ID
	transactionDto.CreatedAt = t.CreatedAt
	transactionJson, err := json.Marshal(transactionDto)

	if err != nil {
		return domain.Transaction{}, err
	}

	err = u.KafkaProducer.Publish(string(transactionJson), "payments")

	if err != nil {
		return domain.Transaction{}, err
	}

	return *t, nil
}
