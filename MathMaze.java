import java.util.*;

public class MathMaze {

   public static void main(String[] args) {
       char[][] maze = new char[][] {
           {'7', '*', '2', '*', '6', '+'},
           {'-', '1', '-', '2', '-', '2'},
           {'3', '*', '5', '+', '5', '-'},
           {'-', '4', '+', '9', '+', '5'},
           {'2', '+', '3', '+', '9', '/'},
           {'+', '9', '/', '3', '*', '7'}
       };
       int target = 6;
       String path = dfs(maze, 0, 0, target, "");
       System.out.println(path);
   }

   static String dfs(char[][] maze, int row, int col, int target, String expr) {
       int rows = maze.length;
       int cols = maze[0].length;
       expr += maze[row][col];

       if (row == rows - 1 && col == cols - 1) {
           if (evaluate(expr) == target) {
               return expr;
           }
           return null;
       }

       if (row + 1 < rows) {
           String result = dfs(maze, row + 1, col, target, expr);
           if (result != null) return result;
       }
       if (col + 1 < cols) {
           String result = dfs(maze, row, col + 1, target, expr);
           if (result != null) return result;
       }
       return null;
   }

   static double evaluate(String expr) {
       List<Double> numbers = new ArrayList<>();
       List<Character> ops = new ArrayList<>();
       StringBuilder num = new StringBuilder();
       for (char c : expr.toCharArray()) {
           if (Character.isDigit(c)) {
               num.append(c);
           } else {
               numbers.add(Double.parseDouble(num.toString()));
               num.setLength(0);
               ops.add(c);
           }
       }
       numbers.add(Double.parseDouble(num.toString()));

       double result = numbers.get(0);
       for (int i = 0; i < ops.size(); i++) {
           switch (ops.get(i)) {
               case '+': result += numbers.get(i + 1); break;
               case '-': result -= numbers.get(i + 1); break;
               case '*': result *= numbers.get(i + 1); break;
               case '/': result /= numbers.get(i + 1); break;
           }
       }
       return result;
   }
}