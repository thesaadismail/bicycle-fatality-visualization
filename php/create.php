<?php
   	include $_SERVER['DOCUMENT_ROOT'].'/php/dbinfo.php';
   
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	
	$myquery="CREATE VIEW current_data AS
	SELECT statenum, casenum, atmcond,  accdate, accday, acchr, accmin, accmon, acctime , dayofweek, lightcond, nmlocat
	FROM data_all";
	
	$query = mysql_query($myquery);
			
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
	mysql_query($query);
	//$result = mysql_fetch_assoc($query);
	//echo "query result".$result;
	/*	
	for ($x = 0; $x < mysql_num_rows($query); $x++) {
		$data[] = mysql_fetch_assoc($query);
	}
	
	echo json_encode($data); */
		
	
    mysql_close($server);
?>