
<?php
	include 'ChromePhp.php';
	include 'dbinfo.php';
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	
	$myquery="
		SELECT state.state category_state, state.id id, for_line_graph.acchr hour , count( for_line_graph.casenum ) fatalities, state.allowed law
		FROM for_line_graph, state
		WHERE for_line_graph.statenum = state.id
		GROUP BY for_line_graph.statenum, for_line_graph.acchr
		ORDER BY for_line_graph.statenum ASC 
	";
	//ChromePhp::log($myquery);		
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
	//ChromePhp::log($data[1]);		
	
    mysql_close($server);
?>