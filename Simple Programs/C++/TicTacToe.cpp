#include <iostream>
#include <vector>
#include <string>

using namespace std;

class TicTacToe {
private:
    vector<string> board;
    vector<vector<int>> winPatterns;
    string n1, n2, turn, player;
    bool flag;

    bool isAvailable(int pos) {
        return pos >= 0 && pos <= 8 && board[pos] == "   ";
    }

    void printGame() {
        cout << "\n     " << board[0] << "    |   " << board[1] << "   |  " << board[2] << endl;
        cout << "\n     __ __ __ __ __ __ __ __ __\n" << endl;
        cout << "\n     " << board[3] << "    |   " << board[4] << "   |  " << board[5] << endl;
        cout << "\n     __ __ __ __ __ __ __ __ __\n" << endl;
        cout << "\n     " << board[6] << "    |   " << board[7] << "   |  " << board[8] << endl;
    }

    bool checkWin() {
        for (const auto& winPattern : winPatterns) {
            if (board[winPattern[0]] == board[winPattern[1]] && board[winPattern[0]] == board[winPattern[2]] && board[winPattern[0]] == turn) {
                return true;
            }
        }
        return false;
    }
    
public:
    TicTacToe(string X_Player_Name, string O_Player_Name) {
        n1 = X_Player_Name;
        n2 = O_Player_Name;
        turn = " X ";
        player = n1;
        flag = false;
        board.resize(9,"   ");
        winPatterns = {{0, 1, 2}, {3, 4, 5}, {6, 7, 8}, {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, {0, 4, 8}, {2, 4, 6}};
    }

    void play() {
    int pos;
    while (true) {
        cout << player << " turn : " << endl;
        cout << "Enter row : ";
        int row;
        cin >> row;
        cout << "Enter column : ";
        int col;
        cin >> col;
        pos = (row - 1) * 3 + (col - 1);
        if (!isAvailable(pos)) {
            cout << "Position not available" << endl;
            continue;
        }
        board[pos] = turn;
        printGame();
        if (checkWin()) {
            cout << player << " wins !" << endl;
            flag = true;
            break;
        }
        turn = turn == " X " ? " O " : " X ";
        player = player == n1 ? n2 : n1;
        
        bool isEmpty = false;
        for (const auto& space : board) {
            if (space == "   ") {
                isEmpty = true;
                break;
            }
        }
        if (! isEmpty) {
            cout << "Tie !" << endl;
            break;
        }
        }
    }
};

int main() {
    string n1, n2;
    cout << "Enter name of player-1 ( X ) : ";
    getline(cin, n1);
    cout << "Enter name of player-2 ( O ) : ";
    getline(cin, n2);
    TicTacToe game(n1, n2);
    game.play();
    return 0;
}