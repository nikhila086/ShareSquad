export interface Participant {
  id: string;
  name: string;
}

export interface ExpenseSplit {
  participantId: string;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // participant id
  splitBetween: ExpenseSplit[];
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  participants: Participant[];
  expenses: Expense[];
  createdAt: string;
}

export interface Balance {
  participantId: string;
  participantName: string;
  balance: number; // positive means they are owed money, negative means they owe money
  owes: { [participantId: string]: number };
  owedBy: { [participantId: string]: number };
}