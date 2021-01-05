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

    public static function getGameLogByUserId($user_id){
        $connection = DatabaseConnection::getInstance()->getConnection();
        
        $gameLogArray = array();
        $query = "select * from game_log 
                    where user_id = $user_id order by id desc;";
        
        $result = $connection->query($query);
        if($result->rowCount() != 0){
            $result = $result->fetchAll();

            foreach ($result as $gameLog){
                $gameLog = GameLog::constructWithId($gameLog['id'], $gameLog['game_time_seconds'], $gameLog['score'], $gameLog['cleared_lines'], $gameLog['difficulty'], $gameLog['user_id']);
                $gameLogArray[] = $gameLog;
            }

        }

        DatabaseConnection::getInstance()->closeConnection();
        return $gameLogArray;
    }

    public static function getBestGameLogByUserId($user_id){
        $connection = DatabaseConnection::getInstance()->getConnection();

        $gameLog = null;

        $query = "SET @x = 0;";
        $result = $connection->query($query);

        $query = "SELECT * FROM 
        (
        SELECT *,@x:=(@x+1) rank 
        FROM  game_log 
        ORDER BY score DESC 
        ) A 
        where user_id = $user_id
        LIMIT 1;";


        $result = $connection->query($query);
        if($result->rowCount() != 0){
            $gameLog = $result->fetchAll()[0];
            $rank = $gameLog['rank'];
            $gameLog = GameLog::constructWithId($gameLog['id'], $gameLog['game_time_seconds'], $gameLog['score'], $gameLog['cleared_lines'], $gameLog['difficulty'], $gameLog['user_id']);
            $gameLog->setRank($rank);
        }

        DatabaseConnection::getInstance()->closeConnection();
        return $gameLog;
    }

    public static function getGameLogPagination($page, $itemsPerPage){
        $connection = DatabaseConnection::getInstance()->getConnection();

        $gameLogArray = array();

        if($page < 0)
            return $gameLogArray;

        $query = "SET @x = 0;";
        $result = $connection->query($query);

        $query = "SELECT * FROM 
        (
        SELECT *,@x:=(@x+1) rank 
        FROM  game_log 
        ORDER BY score DESC 
        ) A 
        LIMIT ". $itemsPerPage ." offset ".$page*$itemsPerPage." ;";


        $result = $connection->query($query);
        if($result->rowCount() != 0){
            $result = $result->fetchAll();

            foreach ($result as $gameLog){
                $rank = $gameLog['rank'];
                $gameLog = GameLog::constructWithId($gameLog['id'], $gameLog['game_time_seconds'], $gameLog['score'], $gameLog['cleared_lines'], $gameLog['difficulty'], $gameLog['user_id']);
                $gameLog->setRank($rank);
                $gameLogArray[] = $gameLog;
            }

        }

        DatabaseConnection::getInstance()->closeConnection();
        return $gameLogArray;
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