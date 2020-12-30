<?php 

require_once(__DIR__.'/../models/GameLog.php');
require_once(__DIR__.'/../db_connection.php');

class GameLogDAO{
    


    private function __construct(){

    }

    public static function createGameLog($game_time_seconds, $score, $cleared_lines, $difficulty, $user_id){
        $connection = DatabaseConnection::getInstance()->getConnection();

        $lastInsertId = null;
        $query = "insert into game_log(game_time_seconds, score, cleared_lines, difficulty, user_id) values (
            '$game_time_seconds', '$score', '$cleared_lines', '$difficulty', '$user_id' )";
 
        $result = $connection->query($query);

        if($result->rowCount() != 0){
            $lastInsertId = $connection->lastInsertId();
        }

        DatabaseConnection::getInstance()->closeConnection();
        return GameLogDAO::getGameLogById($lastInsertId);
    }

    public static function getGameLogById($id){
        $connection = DatabaseConnection::getInstance()->getConnection();
        
        $gameLog = null;
        $query = "select * from game_log 
                    where id = $id;";
        
        $result = $connection->query($query);
        if($result->rowCount() != 0){
            $result = $result->fetchAll()[0];

            $gameLog = GameLog::constructWithId($result['id'], $result['game_time_seconds'], $result['score'], $result['cleared_lines'], $result['difficulty'], $result['user_id']);
        }

        DatabaseConnection::getInstance()->closeConnection();
        return $gameLog;
    }


    public static function updateGameLog(GameLog $gameLog){
        $connection = DatabaseConnection::getInstance()->getConnection();
        DatabaseConnection::getInstance()->closeConnection();
    }

    public static function deleteGameLog(GameLog $gameLog){
        $connection = DatabaseConnection::getInstance()->getConnection();
        DatabaseConnection::getInstance()->closeConnection();
    }


}

?>