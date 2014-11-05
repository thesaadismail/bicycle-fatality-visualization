function init(){
  chart = d3.select('#vis').append('svg')
  vis = chart.append('svg:g')
  //PUT YOUR INIT CODE BELOW

  
  dataMatrix = new CategoryDataMatrix("#heatchartContainer"); 
  dataMatrix.initDataMatrix(); 
}
