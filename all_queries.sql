/*
QUERIES

*/
/* Category Data Matrix related query (inner grid)....THIS ONE WORKS   */
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
	ORDER BY Weather DESC 
	
/* ............................VIEW RELATED QUERY.......................*/	
/* CREATE VIEW....THIS ONE WORKS   */	
CREATE VIEW current_data AS
SELECT statenum, casenum, atmcond, 'crash day', 'crash hr', 'crash min', 'crash mon', 'crash time', 'caseyear', lightcond, nmlocat
FROM data_all


REPLACE VIEW current_data AS
SELECT statenum, casenum, atmcond, 'crash day', 'crash hr', 'crash min', 'crash mon', 'crash time', 'caseyear', lightcond, nmlocat
FROM data_all
where statenum=1


/* ALTER VIEW....THIS ONE WORKS   */
ALTER VIEW current_data 
AS SELECT statenum, casenum, atmcond, 'crash day', 'crash hr', 'crash min', 'crash mon', 'crash time', 'caseyear', lightcond, nmlocat FROM data_all
where statenum<4



