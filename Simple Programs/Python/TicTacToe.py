''' 
Tic Tac Toe

The following code is to run a simple TicTacToe game in your terminal with puython language. 
The following code creates a game for two persons with their names.
The winning person name is displayed as won if any of the players won the game otherwise Tie if no one wins.
'''

class TicTacToe :
  
  def __init__(self,Name1,Name2) :
    self.Name1,self.turn = Name1,' X '
    self.Name2,self.flag = Name2,0
    self.current = self.Name1
    self.turn = {self.Name1 : ' X ', self.Name2 : ' O '}
    self.board=["   " for x in range(9)]
    self.winPatterns=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    
  def __makeMove(self):
    print(f'{self.current} turn')
    pos=(int(input(f"Enter Row : "))-1)*3+(int(input("Enter column : "))-1)
    if pos<0 or pos>8 or self.board[pos]!='   ' :
        return 1
    self.board[pos]=self.turn[self.current]
    
  def __printGame(self):
    print(f'''

            {self.board[0]}  |  {self.board[1]}  |  {self.board[2]}

          __ __ __ __ __ __ __ __

            {self.board[3]}  |  {self.board[4]}  |  {self.board[5]}

          __ __ __ __ __ __ __ __

            {self.board[6]}  |  {self.board[7]}  |  {self.board[8]}

          ''')
    
  def __checkWin(self):
    for i in self.winPatterns:
      p = self.turn[self.current]
      if self.board[i[0]]==self.board[i[1]] and self.board[i[0]]==self.board[i[2]] and self.board[i[1]]==p :
        return True
    return False
  
  def play(self) :
    while('   ' in self.board):
      if self.__makeMove()==1:
          print("\nPosition not available. Try again.\n")
          continue
      self.__printGame()
      if(self.__checkWin()):
        print(f'\n{self.current} Wins !')
        self.flag = 1
        break
      self.current=self.Name1 if self.current==self.Name2 else self.Name2
    if(self.flag==0 and '   ' not in self.board):
      print('\nTie !')
      
Name1,Name2 = input('Enter name of player-1 ( X ) : '),input('Enter name of player-2 ( O ) : ')
game = TicTacToe(Name1,Name2)
game.play()