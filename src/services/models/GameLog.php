<?php
class GameLog{

    private $id;
    private $game_time_seconds;
    private $score;
    private $cleared_lines;
    private $difficulty;
    private $user_id;
    
    public function __construct($game_time_seconds, $score, $cleared_lines, $difficulty, $user_id){
        $this->game_time_seconds = $game_time_seconds;
        $this->score = $score;
        $this->cleared_lines = $cleared_lines;
        $this->difficulty = $difficulty;
        $this->user_id = $user_id;
    } 

    public static function constructWithId($id, $game_time_seconds, $score, $cleared_lines, $difficulty, $user_id){
        $instance = new self($game_time_seconds, $score, $cleared_lines, $difficulty, $user_id);
        $instance->id = $id;
        return $instance;
    }

    
    public function getId(){
        return $this->id;
    }
    public function getGameTimeSecondFormatted(){
        if ($this->game_time_seconds <= 60) {
            return round($this->game_time_seconds) .'s';
        } else if ($this->game_time_seconds<= 60 * 60) {
            return round ($this->game_time_seconds/60) .'min';
        } else if ($this->game_time_seconds <= 60 * 60 * 24) {
            return round ($this->game_time_seconds/60/60) . 'hr';
        } else {
            return round ($this->game_time_seconds/60/60/24) . 'd';
        }
    }
    public function getScore(){
        return $this->score;
    }
    public function getClearedLines(){
        return $this->cleared_lines;
    }
    public function getDifficulty(){
        return $this->difficulty;
    }
    public function getUserId(){
        return $this->user_id;
    }

}
?>