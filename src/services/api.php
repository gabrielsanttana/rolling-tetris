<?php
    require_once 'db_connection.php';
    require_once 'dao/PlayerDAO.php';
    require_once 'models/Player.php';
    session_start();



    if(!$_POST){
        header('Location: ../containers/Login/index.php');
    }

    $method = $_POST['method'];

    

    switch($method ){
        case 'registerPlayer':
            $fieldsRequired = array("name","birthdate","cpf","phoneNumber","email","username","password");

            $player_data = array();

            foreach($fieldsRequired as $field){
                if(!$_POST[$field]){
                    //Retornar erro de campo não preenchido pro cadastro
                    header('Location: ../containers/Login/index.php');
                }
            }

            $player = PlayerDAO::createPlayer($_POST['name'], $_POST['birthdate'], $_POST['cpf'], $_POST['phoneNumber'], $_POST['email'], $_POST['username'], $_POST['password']);
        
        
            if($player != null){
                $_SESSION['user'] = serialize($player);
                header('Location: ../containers/Game/index.php');
            }else{
                //Retornar erro ae na hora de cadastrar
                header('Location: ../containers/Login/index.php');
            }

        break;
        case 'login':
            $fieldsRequired = array("user","password");

            foreach($fieldsRequired as $field){
                if(!$_POST[$field]){
                    //Retornar erro de campo não preenchido pro login
                    header('Location: ../containers/Login/index.php');
                }
            }

            $player = PlayerDAO::loginPlayer($_POST['user'], $_POST['password']);

            if($player != null){
                $_SESSION['user'] = serialize($player);
                header('Location: ../containers/Game/index.php');
            }else{
                //Login errado
                header('Location: ../containers/Login/index.php');
            }

        break;
        case 'registerGame':
            break;
        default:
            header('Location: ../containers/Login/index.php');
        break;
    }




?>