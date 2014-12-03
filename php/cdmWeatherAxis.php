
<?php
	/* include $_SERVER['DOCUMENT_ROOT'].'/php/ChromePhp.php';
	ChromePhp::log('Hello console!');
	ChromePhp::warn('something went wrong!');
*/	
	include 'dbinfo.php';
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	
	$myquery="SELECT atm_cond.type Weather, count( data_all.casenum ) Num_of_Fatalities FROM data_all, atm_cond WHERE atm_cond.id = data_all.atmcond GROUP BY Weather ORDER BY Weather ASC";
	
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