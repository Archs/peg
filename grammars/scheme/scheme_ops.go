package main

import (
	"fmt"
)

func (s *Scheme) plus(vs ...*Value) *Value {
	sum := 0.0
	for _, v := range vs {
		sum += v.Number()
	}
	return &Value{
		Type: TNumber,
		val:  fmt.Sprintf("%.3f", sum),
		s:    s,
	}
}

func (s *Scheme) substract(vs ...*Value) *Value {
	sum := vs[0].Number()
	for _, v := range vs[1:] {
		sum -= v.Number()
	}
	return &Value{
		Type: TNumber,
		val:  fmt.Sprintf("%.3f", sum),
		s:    s,
	}
}

func (s *Scheme) multiply(vs ...*Value) *Value {
	sum := 1.0
	for _, v := range vs {
		sum *= v.Number()
	}
	return &Value{
		Type: TNumber,
		val:  fmt.Sprintf("%.6f", sum),
		s:    s,
	}
}

func (s *Scheme) divide(vs ...*Value) *Value {
	sum := vs[0].Number()
	for _, v := range vs[1:] {
		sum /= v.Number()
	}
	return &Value{
		Type: TNumber,
		val:  fmt.Sprintf("%.3f", sum),
		s:    s,
	}
}

func (s *Scheme) println(vs ...*Value) *Value {
	for _, v := range vs {
		print(v.String())
		print(" ")
	}
	println()
	return nil
}

func (s *Scheme) initOps() {
	s.opmaper["+"] = s.plus
	s.opmaper["-"] = s.substract
	s.opmaper["*"] = s.multiply
	s.opmaper["/"] = s.divide
	s.opmaper["println"] = s.println
}
