library(ICplots)

theme_set(theme_ic())

crimes_plot <- ggplot(crime, aes(x = year, y = count, color = Measure)) +
  geom_line(linewidth = 1) +
  hline
crimes_plot

hom_plot <- ggplot(subset(crime, Measure == "Homicides"),
                   aes(x = year, y = count)) +
  geom_point(subset(crime, Measure == "Homicides" & year == 2022),
                   mapping = aes(x = year, y = count)) +
  geom_line(linewidth = 1) +
  geom_text(subset(crime, Measure == "Homicides" & year == 2022),
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