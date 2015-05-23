package main

import (
	"container/list"
	"errors"
	"strconv"
)

const (
	TBool = iota
	TNil
	TChar
	TString
	TNumber
	TList
	TOP
)

var ()

type Value struct {
	s        *Scheme
	Type     int
	val      string
	operator *Value
	operands []*Value
}

func (v *Value) add(nv *Value) {
	v.operands = append(v.operands, nv)
}

func (v *Value) Bool() bool {
	if v.Type == TBool && v.val == "#f" {
		return false
	}
	if v.Type == TNil {
		return false
	}
	return true
}

func (v *Value) String() string {
	return v.val
}

func (v *Value) Char() string {
	if v.Type != TChar {
		panic(v.val + " is not a Char")
	}
	return string(v.val[1])
}

func (v *Value) Number() float64 {
	if v.Type != TNumber {
		panic(v.val + " is not a number")
	}
	f, err := strconv.ParseFloat(v.val, 64)
	if err != nil {
		panic(err)
	}
	return f
}

func (v *Value) Eval() *Value {
	switch v.Type {
	case TBool, TChar, TString, TNumber, TOP:
		return v
	case TList:
		val, err := v.s.Apply(v)
		if err != nil {
			panic(err)
		}
		return val
	}
	return nil
}

type Scheme struct {
	lists   []*Value
	current *Value
	stack   *list.List
	opmaper map[string]func(args ...*Value) *Value
}

func (s *Scheme) Init() {
	s.lists = make([]*Value, 0)
	s.stack = list.New()
	s.opmaper = make(map[string]func(args ...*Value) *Value)
}

func (s *Scheme) Apply(list *Value) (*Value, error) {
	op := list.operator.Eval()
	fn, ok := s.opmaper[op.String()]
	if !ok {
		return nil, errors.New("no operator " + op.String() + " found")
	}
	return fn(list.operands...), nil
}

func (s *Scheme) NewList() *Value {
	lst := &Value{
		Type: TList,
		s:    s,
	}
	return lst
}

func (s *Scheme) BeginList() {
	println("begin list")
	if s.current != nil {
		s.stack.PushBack(s.current)
	}
	s.current = s.NewList()
}

func (s *Scheme) EndList(sval string) {
	println("end list")
	s.current.val = sval
	el := s.stack.Back()
	if el == nil {
		s.lists = append(s.lists, s.current)
		s.current = nil
	} else {
		parent := el.Value.(*Value)
		// add new list to parent list
		parent.add(s.current)
		s.current = parent
		// pop stack
		s.stack.Remove(el)
	}
}

func (s *Scheme) NewBool(sval string) {
	nv := &Value{
		Type: TBool,
		val:  sval,
		s:    s,
	}
	s.current.add(nv)
}

func (s *Scheme) NewChar(sval string) {
	nv := &Value{
		Type: TChar,
		val:  sval,
		s:    s,
	}
	s.current.add(nv)
}

func (s *Scheme) NewString(sval string) {
	nv := &Value{
		Type: TString,
		val:  sval,
		s:    s,
	}
	s.current.add(nv)
}

func (s *Scheme) NewNumber(sval string) {
	nv := &Value{
		Type: TNumber,
		val:  sval,
		s:    s,
	}
	s.current.add(nv)
}

func (s *Scheme) NewOP(sval string) {
	nv := &Value{
		Type: TOP,
		val:  sval,
		s:    s,
	}
	s.current.add(nv)
}

func (s *Scheme) NewNil(sval string) {
	nv := &Value{
		Type: TNil,
		val:  sval,
		s:    s,
	}
	s.current.add(nv)
}

func (s *Scheme) println(sval string) {
	println(sval)
}

func (s *Scheme) PrintLists() {
	for _, v := range s.lists {
		println(v.String())
		print("content:")
		for _, sv := range v.operands {
			print(sv.String(), " ")
		}
		println()
	}
}
