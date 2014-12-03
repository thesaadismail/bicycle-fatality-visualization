
<?php
	/* include $_SERVER['DOCUMENT_ROOT'].'/php/ChromePhp.php';
	ChromePhp::log('Hello console!');
	ChromePhp::warn('something went wrong!');
*/	
	include 'dbinfo.php';
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	
	$myquery="
		SELECT nm_location.type Location, count( current_data.casenum ) Num_of_Fatalities
		FROM current_data, nm_location
		WHERE nm_location.id = current_data.nmlocat
		GROUP BY Location
		ORDER BY Location ASC 
	";
	
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
		
	
    mysql_close($server);
?>