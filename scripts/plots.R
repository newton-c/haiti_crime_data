library(ICplots)
library(packcircles)
library(ggiraph)

theme_set(theme_ic())

crimes_plot <- ggplot(crime, aes(x = year, y = count, color = Measure)) +
  geom_line(linewidth = 1) +
  hline
crimes_plot

hom_plot_data <- filter(crime, Measure == "Homicides")
#write_csv(hom_plot_data, "data/hom_plot_data.csv")
hom_plot <- ggplot(hom_plot_data,
                   aes(x = year, y = count)) +
  geom_point(subset(hom_plot_data, year == 2022),
                   mapping = aes(x = year, y = count)) +
  geom_line(linewidth = 1) +
  geom_text(subset(hom_plot_data, year == 2022),
                   mapping = aes(x = year - .2, y = count - 500),
            label = "91% increase in\nhomicides\n2019-2022",
            family = "Roboto Black") +
  labs(title = "Homicides in Haïti") +
  xlab("") +
  ylab("Number of Victims") +
  hline
hom_plot

kidnap_plot <- ggplot(subset(crime, Measure == "Kidnappings"),
                   aes(x = year, y = count)) +
  geom_point(subset(crime, Measure == "Kidnappings" & year == 2022),
                   mapping = aes(x = year, y = count)) +
  geom_line(linewidth = 1) +
  geom_text(subset(crime, Measure == "Kidnappings" & year == 2022),
                   mapping = aes(x = year - .2, y = count - 500),
            label = "1642% increase in\nkidnappings\n2019-2022",
            family = "Roboto Black") +
  labs(title = "Kidnappings in Haïti") +
  xlab("") +
  ylab("Number of Victims") +
  hline
kidnap_plot

idps_ts_plot <- ggplot(subset(idps_la, name == "Haiti"& year != 2023),
                   aes(x = year, y = conflict_internal_displacements)) +
  geom_point(subset(idps_la, name == "Haiti" & year == 2022),
                   mapping = aes(x = year, y = conflict_internal_displacements)) +
  geom_line(linewidth = 1) +
  geom_text(subset(idps_la, name == "Haiti" & year == 2022),
                   mapping = aes(x = year - .5,
                                 y = conflict_internal_displacements - 10000),
            label = "430% increase in\nIPDs\n2019-2022",
            family = "Roboto Black") +
  labs(title = "Internally Displaced People (IDPs) in Haïti") +
  xlab("") +
  ylab("Number of Victims") +
  hline
idps_ts_plot

# circle plot
idps_la_22 <- filter(idps_la, year == 2022)
packing <- circleProgressiveLayout(abs(idps_la_22$change_internal_dispalcements),
                                   sizetype = "area")

data <- cbind(idps_la_22, packing)

dat.gg <- circleLayoutVertices(packing, npoints=50)

# Make the plot
packed_circle_plot <- ggplot() + 
  geom_point(data = data, aes(x, y, size = abs(change_internal_dispalcements)),
             alpha = 1, fill = "#3B3B3B") +
  # Make the bubbles
  geom_polygon(data = dat.gg, aes(x, y, group = id,
                                  #fill = ifelse(name %in% c("Haiti", "Colombia"),
                                  #              "red", "green")),
                                  fill = ifelse(id %in% c(2, 5),
                                                "Increase in IDPs",
                                                "Decrease in IDPs")),
               alpha = 1) +
  
  # Add text in the center of each bubble + control its size
  geom_text(data = data, aes(x, y,
                             label = paste0(name, "\n",
                                           round(change_internal_dispalcements),
                                           "%")),
            size = abs(data$change_internal_dispalcements) / 40,
            family = "Roboto Bold") +
  scale_size_continuous(range = c(1, 4), breaks = c(100, 400)) +
  labs(title = "Change in Internally Displaced People in Latin America",
       subtitle = "2021-2022",
       fill = "Change in IDPs\n2021-2022",
       size = "% Change in IDPs\n2021-2022") +
  # General theme:
  theme_void() + 
  theme(plot.title = element_text(family = "Roboto Black", size = 24),
        plot.subtitle = element_text(family = "Roboto", size = 18),
        legend.position = "top") +
  scale_fill_manual(values = c("darkgreen", "darkred")) +
  coord_equal()
packed_circle_plot

#https://www.ipcinfo.org/ipc-country-analysis/details-map/en/c/1156263/?iso3=HTI
#https://www.ipcinfo.org/ipc-country-analysis/details-map/en/c/1155488/?iso3=HTI
#https://www.ipcinfo.org/ipc-country-analysis/details-map/en/c/1152816/?iso3=HTI
#https://www.ipcinfo.org/ipc-country-analysis/details-map/en/c/1152203/?iso3=HTI
#https://www.ipcinfo.org/ipc-country-analysis/details-map/en/c/1151865/?iso3=HTI

hunger <- tibble(year = c(2023, 2022, 2021, 2020, 2019),
                 phase_4 = c(1807955, 1317626, 1156915, 1203282, 517129))

hunger_plot <- ggplot(hunger, aes(x = year, y = phase_4)) +
  geom_line(linewidth = 1) +
  geom_point(data = subset(hunger, year == 2023)) +
  geom_text(data = subset(hunger, year == 2023),
            aes(x = year - .2, y = phase_4 - 450000),
            label = paste("The number of",
                          "people suffering",
                          "from emergency",
                          "levels of food",
                          "insecurity has",
                          "risen 250% from",
                          "2019 - 2023",
                          sep = "\n"),
            family = "Roboto Black") +
  labs(title = "Number of Haitians Suffering from Emergency Food Insecurity") +
  hline +
  xlab("") +
  ylab("# of People")
hunger_plot


# Gang violence ---------------------------------------------------------------
ggplot(data = subset(acled, grepl("Gang", actor1) == TRUE),
       aes(x = event_date, y = fatalities)) +
  geom_line(group = 1)

