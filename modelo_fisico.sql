create table player(
    id int AUTO_INCREMENT PRIMARY KEY,
	name varchar(50) not null,
    birthdate date not null,
    cpf varchar(20) not null,
    phoneNumber varchar(20) not null,
    email varchar(50) not null,
    username varchar(50) not null,
    password varchar(50) not null
);

create table game_log(
    id int AUTO_INCREMENT PRIMARY KEY,
	game_time_seconds int not null,
    score int not null,
    cleared_lines int not null,
    difficulty int not null,
    user_id int not null
);

ALTER TABLE game_log
ADD FOREIGN KEY (user_id) REFERENCES player(id);