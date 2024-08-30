/*
The following code is to run a simple TicTacToe game in your terminal with java language. 
The following code creates a game for two persons with their names.
The winning person name is displayed as won if any of the players won the game otherwise Tie if no one wins.
*/ 

import java.util.*;
public class TicTacToe {
    List<String> board;
    List<List<Integer>> winPatterns;
    String n1,n2,turn,player;
    boolean flag;

    public TicTacToe(String X_Player_Name,String O_Player_Name){
        this.n1 = X_Player_Name;
        this.n2 = O_Player_Name;
        this.turn = " X ";
        this.player = n1;
        this.flag = false;
        board = new ArrayList<>();
        for(int i=0;i<9;++i) board.add("   ");
        winPatterns = new ArrayList<>();
        addPattern(0,1,2,new ArrayList<>());
        addPattern(3,4,5,new ArrayList<>());
        addPattern(6,8,7,new ArrayList<>());
        addPattern(0,3,6,new ArrayList<>());
        addPattern(1,4,7,new ArrayList<>());
        addPattern(2,5,8,new ArrayList<>());
        addPattern(0,4,8,new ArrayList<>());
        addPattern(2,4,6,new ArrayList<>());
    }

    private void addPattern(int x,int y,int z,List<Integer> pattern){
        pattern.add(x);pattern.add(y);pattern.add(z);
        this.winPatterns.add(pattern);
    }
    
    private boolean isAvailable(int pos){
        return pos >= 0 && pos <= 8 && board.get(pos).equals("   ");
    } 

    private void printGame(){
        System.out.println("\n     " + board.get(0) + "    |   " + board.get(1) + "   |  " + board.get(2));
        System.out.println("\n     __ __ __ __ __ __ __ __ __\n");
        System.out.println("\n     " + board.get(3) + "    |   " + board.get(4) + "   |  " + board.get(5));
        System.out.println("\n     __ __ __ __ __ __ __ __ __\n");
        System.out.println("\n     " + board.get(6) + "    |   " + board.get(7) + "   |  " + board.get(8) + "\n");
    }
    
    private boolean checkWin(){
        for(List<Integer> winPattern : winPatterns){
            if(this.board.get(winPattern.get(0)).equals(this.board.get(winPattern.get(1))) &&
               this.board.get(winPattern.get(0)).equals(this.board.get(winPattern.get(2))) &&
               this.board.get(winPattern.get(0)).equals(this.turn)) return true;
        } return false;
    }

    public void play(Scanner sc){ 
        int pos;
        while (this.board.contains("   ")) { 
            System.out.println(player + " turn : ");
            System.out.print("Enter row : ");
            pos = (sc.nextInt()-1) * 3;
            System.out.print("Enter column : ");
            pos += (sc.nextInt()-1); 
            if(!this.isAvailable(pos)){
                System.out.println("Position not available"); continue;
            }this.board.set(pos,this.turn);
            this.printGame();
            if(this.checkWin()){
                System.out.println(player + " wins !"); this.flag = true; break;
            }
            this.turn = this.turn.equals(" X ") ? " O " : " X ";
            this.player = player.equals(this.n1) ? this.n2 : this.n1;
        }
        if(!this.flag){
            System.out.println("Tie !");
        }sc.close();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter name of player-1 ( X ) : ");
        String n1 = sc.nextLine();
        System.out.print("Enter name of player-2 ( O ) : ");
        String n2 = sc.nextLine();
        TicTacToe game = new TicTacToe(n1,n2);
        game.play(sc);
    }
}