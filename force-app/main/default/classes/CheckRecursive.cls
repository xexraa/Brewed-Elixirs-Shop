public class CheckRecursive {

    private static Integer run = 0;

    public static Boolean runOnce() {
        if (run < 2) {
            run++;
            return true;
        } else {
            return false;
        }
    }
}