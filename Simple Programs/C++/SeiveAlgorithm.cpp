/*
Sieve of Eratosthenes

In mathematics, the sieve of Eratosthenes is an ancient algorithm for finding all prime numbers
up to any given limit.

It does so by iteratively marking as composite (i.e., not prime) the multiples of each prime, 
starting with the first prime number, 2. The multiples of a given prime are generated as a sequence 
of numbers starting from that prime, with constant difference between them that is equal to that prime.
This is the sieve's key distinction from using trial division to sequentially test each candidate number 
for divisibility by each prime. Once all the multiples of each discovered prime have been marked as composites, 
the remaining unmarked numbers are primes.

The time complexity of the Sieve of Eratosthenes is O(n log log n)
*/

#include<iostream>
#include<vector>

using namespace std;

class SeiveOfEratosthenes{
    private :
    
    long n;
    vector<long> primeNumbers;
    
    vector<long> getPrimes(long n){
        vector<bool> primes(n + 1,true);
        long i;
        primes.at(0) = primes.at(1) = false;
        for(i = 2; i*i <= n; ++i){
            if(!primes.at((int)i)) continue;
            for(long j = 2 * i; j <= n; j += i) primes.at((int)j) = false;
            this -> primeNumbers.push_back(i);
        }
        for(;i <= n; ++i)
            if(primes.at((int)i)) this -> primeNumbers.push_back(i);
        return primeNumbers;
    }
    
    void display(vector<long> list){
        cout << "Prime numbers between 0 and " << n << ":";
        if(! list.size()) cout << " None";
        else
            for(long & i : list) cout << " " << i;
    }

    public :

    SeiveOfEratosthenes(long n){
        this -> n = n;
    }

    void performOperation(){
        this -> primeNumbers = getPrimes(this -> n);
        display(this -> primeNumbers);
    }
};

int main(){
    long n;
    cout << "Enter positive integer : ";
    cin >> n;
    SeiveOfEratosthenes seiveOfEratosthenes(n);
    seiveOfEratosthenes.performOperation();
    return 0;
}