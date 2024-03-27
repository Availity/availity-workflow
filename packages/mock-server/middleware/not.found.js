export default function notfound() {
  return (req, res) => {
    res.status(404);

    const message = 'Not Found';

    if (req.accepts('html')) {
      res
        .type('html')
        .status(404)
        .end(
          '<!DOCTYPE html> <html> <head> <title>Dummy Mock Server Response</title> </head> <body> <h1>Not Found<h1> </body> </html>'
        );
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.type('json').send({ error: message });
      return;
    }

    // respond with json
    if (req.accepts('xml')) {
      res.type('xml').send(`<error><message>${message}</message></error>`);
      return;
    }

    // default to plain-text. send()
    res.type('txt').send({ error: message });
  };
};
