var chartDom1 = document.getElementById('chart-container2');
var myChart1 = echarts.init(chartDom1);
var option;
fetch("data/scatter.json")
  .then(response => response.json())
  .then(json => {
    const colors = new Map();
    colors.set('Staten Island',"steelblue");
    colors.set('Bronx',"green");
    colors.set('Manhattan',"red");
    colors.set('Brooklyn',"orange");
    colors.set('Queens',"purple");

    var neighbours = [];
    var groupedData = json.reduce(function(acc, item) {
      var key = item.neighbourhood_group;
      var existingNeighbourhood = acc.find(function(neighbourhood) {
        return neighbourhood.name === key;
      });
      if (existingNeighbourhood) {
        existingNeighbourhood.data.push([item.m_price,item.m_review,item.count]);
      } else {
        acc.push({
          name: key,
          data: [
            [item.m_price,item.m_review,item.count]
          ],
          symbolSize: function (data) {
            return Math.sqrt(data[2]);
          },
          emphasis: {
            focus: 'series',
            label: {
              show: true,
              formatter: function (param) {
                console.log(param);
                return param.name;
              },
              position: 'top'
            }
          },
          type: 'scatter',
          itemStyle: {
            color: colors.get(key),
            
            opacity: 0.5
          }
        });
        neighbours.push(key);

      }
      return acc;
    }, []);
  
  console.log(groupedData);

  option = {
    xAxis: {
      name: 'Average Price per Night',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        fontSize: 16
      },
    },
    yAxis: {
      name: 'Average Reviews',
      nameTextStyle: {
        fontSize: 16
      },
    },
    legend: {
      right: '10%',
      top: '3%',
      data: neighbours
    },
    series: groupedData
  };
  

  option && myChart1.setOption(option);
})
