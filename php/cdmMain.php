<?php
	include 'ChromePhp.php';
	
	include 'dbinfo.php';
	//ChromePhp::log("START cdmMain =>");     
	
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	
	
	$myquery="
  	SELECT Weather, Location, Sum(
	CASE WHEN casenum IS NULL
	THEN 0
	ELSE 1
	END ) Number_Of_Cases
	FROM (
	SELECT atm_cond.id Weather_ID, atm_cond.type Weather, nm_location.id Location_ID, nm_location.type Location
	FROM atm_cond, nm_location
	)Temp
	LEFT OUTER JOIN current_data ON Temp.Weather_ID = current_data.atmcond
	AND Temp.Location_ID = current_data.nmlocat
	GROUP BY Weather, Location
	ORDER BY Weather, Location ASC 
	";
	//ChromePhp::log("QUERYING cdmMain =>");     
	
	$query = mysql_query($myquery);
			
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
	
	$data = array();
	
	for ($x = 0; $x < mysql_num_rows($query); $x++) {
		$data[] = mysql_fetch_assoc($query);
	}
	
	echo json_encode($data);		
	//ChromePhp::log("END cdmMain =>");    
    mysql_close($server);
	//ChromePhp::log("SERVER CLOSED cdmMain =>");    
?>	