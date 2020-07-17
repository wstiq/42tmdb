<?php
require_once "read_cache.php"; // Пытаемся вывести содержимое кэша
include ("index.html"); //загрузка страницы
require_once "write_cache.php"; // Здесь идёт сохранение сгенерированной страницы в кэш
?>