import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import MultiActionAreaCard from "../components/MultiActionAreaCard";
import { styled } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import InputAdornment from "@mui/material/InputAdornment";
import QRCode from "react-qr-code";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const WS_URL = "ws://localhost:3001/api/events";

function Search() {
  const [data, setData] = React.useState(null);
  const [showCart, setShowCart] = React.useState(false);
  const [cartitems, setCartItems] = React.useState([]);
  const [invoice, setInvoice] = React.useState({});
  const [paymentComplete, setPaymentComplete] = React.useState(false);

  const addToCart = (product, qty) => {
    console.log("qty:" + qty + " x prod:" + product);
    setCartItems((oldCartItems) => [...oldCartItems, { product, qty }]);
    setShowCart(true);
  };

  const removeFromCart = (product) => {
    var array = cartitems.filter((item) => item.product.id !== product.id);
    console.log(
      "deleting = " + product.id + " new array:" + JSON.stringify(array)
    );
    setCartItems(array);
  };

  const showInvoice = () => {
    setPaymentComplete(false);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartitems }),
    };

    fetch("/buy", requestOptions)
      .then((res) => res.json())
      .then((data) => setInvoice(data.invoice));
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setShowCart(open);
  };

  const getEventsSocket = () => {
    return new WebSocket(WS_URL);
  };
  const ws = getEventsSocket();

  const onSocketMessage = (msg) => {
    const event = JSON.parse(msg.data);
    if (event.type === "invoice-paid") {
      // upvote the post when the incoming payment is made for the
      console.log(event.data);
      setPaymentComplete(true); //obv check if its the same inv requested
    }
  };
  ws.addEventListener("message", onSocketMessage);

  const cartView = () => (
    <Box sx={{ width: 550 }} role="presentation">
      <List>
        {cartitems &&
          cartitems.length &&
          cartitems.map((item, index) => (
            <ListItem button key={item.product.id}>
              <ListItemText primary={item.product.name} secondary={item.qty} />
              <DeleteIcon onClick={() => removeFromCart(item.product)} />
            </ListItem>
          ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Container sx={{ textAlign: "right" }}>Total 15000</Container>
      <Container sx={{ textAlign: "right" }}>
        <Button variant="contained" onClick={showInvoice}>
          Pay
        </Button>
      </Container>
      <Divider />
      {invoice && invoice.request && invoice.request.length > 0 && (
        <Container>
          <h2>Invoice for {invoice.mtokens} Sats</h2>

          <Container sx={{ textAlign: "center" }}>
            <QRCode value={invoice.request} />
            <TextField
              fullWidth
              sx={{ m: 1 }}
              value={invoice.request}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">฿</InputAdornment>
                ),
              }}
              label="LN Invoice"
            />
          </Container>
          <Container>
            {paymentComplete && (
              <Container>
                <Alert severity="success" variant="filled">
                  <AlertTitle>
                    <strong>Payment Success</strong>
                  </AlertTitle>
                  Your payment has been confirmed <strong>Thank You!</strong>
                </Alert>
              </Container>
            )}
          </Container>
        </Container>
      )}
    </Box>
  );

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  React.useEffect(() => {
    fetch("/search")
      .then((res) => res.json())
      .then((data) => setData(data.products));
  }, []);

  return (
    <Container maxWidth="md">
      <Container sx={{ padding: 5, textAlign: "center" }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField label="Search" fullWidth variant="outlined" />
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" size="large">
              Search
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Grid sx={{ flexGrow: 1 }} container spacing={1}>
        {data &&
          data.length > 0 &&
          data.map((product) => (
            <Grid key={product.id} item xs={6}>
              <MultiActionAreaCard
                product={product}
                showPayment={addToCart}
                addToCart={addToCart}
              ></MultiActionAreaCard>
            </Grid>
          ))}
      </Grid>
      {!data && "Loading..."}

      <React.Fragment key="right">
        <Drawer
          anchor="right"
          variant="persistent"
          open={showCart}
          onClose={toggleDrawer(false)}
        >
          <DrawerHeader>
            <h2>Cart - {cartitems.length} items</h2>
            <IconButton onClick={toggleDrawer(false)}>
              <ChevronRightIcon />
            </IconButton>
          </DrawerHeader>
          <Box
            sx={{
              px: 2,
              pb: 2,
              height: "100%",
              overflow: "auto",
            }}
            role="presentation"
          >
            {cartView()}
          </Box>
        </Drawer>
      </React.Fragment>
    </Container>
  );
}

export default Search;
