package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"github.com/pedrorougemont/codebank/infrastructure/grpc/server"
	"github.com/pedrorougemont/codebank/infrastructure/kafka"
	"github.com/pedrorougemont/codebank/infrastructure/repository"
	"github.com/pedrorougemont/codebank/usecase"
)

func main() {
	db := setupDb()
	defer db.Close()
	producer := setupKafkaProducer()
	processTransactionUseCase := setupTransactionUseCase(db, producer)
	serveGRPC(processTransactionUseCase)
}

func setupDb() *sql.DB {
	psqlInfo := fmt.Sprintf("host= %s port=%d user=%s password=%s dbname=%s sslmode=disable",
		"db",
		5432,
		"postgres",
		"root",
		"codebank",
	)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("Error connecting to database.")
	}
	return db
}

func setupKafkaProducer() kafka.KafkaProducer {
	producer := kafka.NewKafkaProducer()
	producer.SetupProducer("host.docker.internal:9094")
	return producer
}

func setupTransactionUseCase(db *sql.DB, producer kafka.KafkaProducer) usecase.UseCaseTransaction {
	transactionRepository := repository.NewTransactionRepositoryDb(db)
	useCase := usecase.NewUseCaseTransaction(transactionRepository)
	useCase.KafkaProducer = producer
	return useCase
}

func serveGRPC(processTransactionUseCase usecase.UseCaseTransaction) {
	grpcServer := server.NewGRPCServer()
	grpcServer.ProcessTransactionUseCase = processTransactionUseCase
	fmt.Println("Rodando GRPC Server")
	grpcServer.Serve()
}

/*
func insertCreditCard(db *sql.DB) {
	cc := domain.NewCreditCard()
	cc.Number = "1234"
	cc.Name = "Pedro"
	cc.ExpirationYear = 2021
	cc.ExpirationMonth = 7
	cc.CVV = 123
	cc.Limit = 1000
	cc.Balance = 0

	repo := repository.NewTransactionRepositoryDb(db)
	err := repo.CreateCreditCard(*cc)

	if err != nil {
		fmt.Println(err)
	}
}
*/
