package server

import (
	"log"
	"net"

	"github.com/pedrorougemont/codebank/infrastructure/grpc/pb"
	"github.com/pedrorougemont/codebank/infrastructure/grpc/service"
	"github.com/pedrorougemont/codebank/usecase"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type GRPCServer struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
}

func NewGRPCServer() GRPCServer {
	return GRPCServer{}
}

func (s *GRPCServer) Serve() {
	lis, err := net.Listen("tcp", "0.0.0.0:50052")
	if err != nil {
		log.Fatalf("Could not listen TCP port.")
	}

	grpcServer := grpc.NewServer()
	transactionService := service.NewTransactionService()
	transactionService.ProcessTransactionUseCase = s.ProcessTransactionUseCase
	reflection.Register(grpcServer)
	pb.RegisterPaymentServiceServer(grpcServer, transactionService)

	grpcServer.Serve(lis)

}
