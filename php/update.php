<?php
    $username = "root"; 
    $password = "";   
    $host = "localhost";
    $database="iv";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	
	$myquery="ALTER VIEW current_data 
AS SELECT statenum, casenum, atmcond, 'crash day', 'crash hr', 'crash min', 'crash mon', 'crash time', 'caseyear', lightcond, nmlocat FROM data_all
where statenum<14";
	
	$query = mysql_query($myquery);
			
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
	
	mysql_query($query);
	echo "query result";
	/*	
	for ($x = 0; $x < mysql_num_rows($query); $x++) {
		$data[] = mysql_fetch_assoc($query);
	}
	
	echo json_encode($data); */
		
	
    mysql_close($server);
?>