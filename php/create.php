<?php
    $username = "root"; 
    $password = "";   
    $host = "localhost";
    $database="iv";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	
	$myquery="CREATE VIEW current_data1 AS
	SELECT statenum, casenum, atmcond, 'crash day', 'crash hr', 'crash min', 'crash mon', 'crash time', 'caseyear', lightcond, nmlocat
	FROM data_all";
	
	$query = mysql_query($myquery);
			
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
	
	$result = mysql_fetch_assoc($query);
	echo "query result".$result;
	/*	
	for ($x = 0; $x < mysql_num_rows($query); $x++) {
		$data[] = mysql_fetch_assoc($query);
	}
	
	echo json_encode($data); */
		
	
    mysql_close($server);
?>