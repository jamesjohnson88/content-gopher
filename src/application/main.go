package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)
	fmt.Println("Content Gopher x AI Slop")
	fmt.Println("--------------------------")
	fmt.Println("Type 'exit' to quit")

	for {
		fmt.Print("> ")
		input, err := reader.ReadString('\n')
		if err != nil {
			fmt.Fprintln(os.Stderr, "Error reading input:", err)
			continue
		}

		// Trim the newline character and any whitespace
		input = strings.TrimSpace(input)

		// Process the input
		if input == "exit" {
			fmt.Println("Exiting...")
			break
		}

		// Handle the input
		fmt.Printf("You entered %s\n", input)
	}
}
