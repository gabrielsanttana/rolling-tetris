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

}
?>