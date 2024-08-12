#include <iostream>
#include <vector>


int N, M, V;
std::vector<std::vector<int>> v;

void dfs(){}
void bfs(){}

void printing2D(int x, int y){
  for(auto i = 0 ; i < x; ++i){
    for(auto j = 0; j < y; ++j){
      std::cout << v[i][j] << " ";
    }
    std::cout << "\n";
  }
};


int main(){
    std::cin.tie(NULL);
    std::ios::sync_with_stdio(false);
    
    std::cin >> N >> M >> V;

    std::vector<std::vector<int>> v(M,2);

    for(auto i = 0; i < M; ++i){
      int tmp1, tmp2;
      std::cin >> tmp1 >> tmp2;
      v[i][0] = tmp1;
      v[i][1] = tmp2;
    }

    printing2D(M,2);
    std::cout << N << M << V << "\n";

    return 0;
}