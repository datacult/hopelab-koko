setwd('/Users/aminabrown/Documents/hopelab-koko/')

## Streamgraph
# Library
library(streamgraph)

# Create data:
data <- read.csv('impact_long.csv')

# Basic stream graph: just give the 3 arguments
pp <- streamgraph(data, key="Platform", value="Users", date="Date")
pp

pp_cumulative = streamgraph(data, key="Platform", value="Cumulative", date="Date")
pp_cumulative


## Stacked Area
# Library
library(ggplot2)
library(dplyr)

as.Date(data$Date, format='%y%m%d')

ggplot(data, aes(x=as.Date(Date, format='%y%m%d'), y=Users, fill=Platform)) + 
  geom_area()

ggplot(data, aes(x=Date, y=Cumulative, fill=Platform)) + 
  geom_area()
