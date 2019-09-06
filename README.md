# Spyro
A Chrome extension for working with a combination of JIRA and Splunk to create event types that correspond to JIRAs.

## Foundational Design Choices
This project is created with the following fundamental design choices:

### Shared Configuration
A single shared configuration, meaning everyone is always logging issues and creating event types consistently with others using the same configuration.

### Simple
When creating events and issues, the only thing that someone should have to think about is the Splunk search that defines the event type (as this is the part that generally requires a person's participation).  

### Guided
The process should be guided.  Ensure that when logging issues, the person logging issues is guided through the right steps required to be compliant with process.

### Configurable
Process and practices change.  The steps taken to log issues should be externalized into configuration to ensure that it can change in the future.

## Development
If you are interested in developing on this project, see the [Developing](./Developing) documentation for more information.
