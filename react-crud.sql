-- Create database
CREATE DATABASE react_crud;

-- Create users table
CREATE TABLE `react_crud`.`users`
(
    `id` int NOT NULL auto_increment,
    `NomMed` varchar(50),
    `Nbr_jours` int,
    `Taux_journalier` int,
     `Prestation` int
);
