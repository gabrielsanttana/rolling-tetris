<?php
class GameLog{

    private $id;
    private $rank;
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

    public function getDifficultyFormatted(){
        switch ($this->difficulty) {
            case 0:
              return 'Fácil';
      
            case 1:
              return 'Média';
      
            case 2:
              return 'Difícil';
      
            case 3:
              return 'Extrema';
      
            default:
              return 'Insana';
          }
    }

    public function getUserId(){
        return $this->user_id;
    }
    
    public function setRank($rank){
        $this->rank = $rank;
    }

    public function getRank(){
        return $this->rank;
    }

}
?>