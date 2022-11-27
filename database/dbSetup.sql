-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 28 nov 2022 om 00:45
-- Serverversie: 10.4.27-MariaDB
-- PHP-versie: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `php_crud`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `items`
--

CREATE TABLE `items` (
  `ID` int(11) NOT NULL,
  `Subject` varchar(30) NOT NULL,
  `User` int(11) NOT NULL,
  `Content` text DEFAULT NULL,
  `BeginDate` date NOT NULL DEFAULT current_timestamp(),
  `EndDate` date DEFAULT NULL,
  `Priority` tinyint(1) DEFAULT NULL,
  `Status` enum('n','b','a') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `notifications`
--

CREATE TABLE `notifications` (
  `ID` int(11) NOT NULL,
  `FromUser` int(11) NOT NULL,
  `ToUser` int(11) NOT NULL,
  `Message` varchar(255) DEFAULT NULL,
  `Item` int(11) DEFAULT NULL,
  `Seen` tinyint(1) NOT NULL DEFAULT 0,
  `SendDate` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `Email` varchar(320) NOT NULL,
  `Salt` char(10) NOT NULL,
  `Password` char(60) NOT NULL,
  `LoginToken` char(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User` (`User`);

--
-- Indexen voor tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FromUser` (`FromUser`,`ToUser`),
  ADD KEY `FromUser_2` (`FromUser`,`ToUser`),
  ADD KEY `ToUser` (`ToUser`);

--
-- Indexen voor tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `items`
--
ALTER TABLE `items`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT voor een tabel `notifications`
--
ALTER TABLE `notifications`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT voor een tabel `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`User`) REFERENCES `users` (`ID`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`FromUser`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`ToUser`) REFERENCES `users` (`ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
