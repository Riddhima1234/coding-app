Your IP textbox name = textLocalIp,
Your Port textbox name = textLocalPort,
Friend's IP textbox name = textFriendsIp
Friend's Port textbox name = textFriendsPort
Listbox Message name = listMessage,
Textbox for Message sending name = textMessage,
Start Button name = buttonStart,
Send Button name = buttonSend

using System.Net;
using System.Net.Sockets;

// set up socket
sck = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
sck.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);

// get own IP
textLocalIp.Text = GetLocalIP();
textFriendsIp.Text = GetLocalIP();

// Return your own IP
private string GetLocalIP()
{
    IPHostEntry host;
    host = Dns.GetHostEntry(Dns.GetHostName());
    foreach (IPAddress ip in host.AddressList)
    {
        if (ip.AddressFamily == AddressFamily.InterNetwork)
        {
            return ip.ToString();
        }
    }
    return "127.0.0.1";
}

try
{
    // binding socket
    epLocal = new IPEndPoint(IPAddress.Parse(textLocalIp.Text),
    Convert.ToInt32(textLocalPort.Text));
    sck.Bind(epLocal);
    // connect to remote IP and port
    epRemote = new IPEndPoint(IPAddress.Parse(textFriendsIp.Text),
    Convert.ToInt32(textFriendsPort.Text));
    sck.Connect(epRemote);
    // starts to listen to an specific port
    buffer = new byte[1500];
    sck.BeginReceiveFrom(buffer, 0, buffer.Length, SocketFlags.None, ref epRemote, new
    AsyncCallback(MessageCallBack), buffer);
    // release button to send message
    buttonSend.Enabled = true;
    buttonStart.Text = "Connected";
    buttonStart.Enabled = false;
    textMessage.Focus();
}
catch (Exception ex)
{
    MessageBox.Show(ex.ToString());
}

try
{
    int size = sck.EndReceiveFrom(aResult, ref epRemote);
    // check if theres actually information
    if (size > 0)
    {
        // used to help us on getting the data
        byte[] receivedData = new byte[1464];
        // getting the message data
        receivedData = (byte[])aResult.AsyncState;
        // converts message data byte array to string
        ASCIIEncoding eEncoding = new ASCIIEncoding();
        string receivedMessage = eEncoding.GetString(receivedData);
        // adding Message to the listbox
        listMessage.Items.Add("Friend: " + receivedMessage);
    }
    // starts to listen the socket again
    buffer = new byte[1500];
    sck.BeginReceiveFrom(buffer, 0, buffer.Length, SocketFlags.None, ref epRemote, new AsyncCallback(MessageCallBack), buffer);
}
catch (Exception exp)
{
    MessageBox.Show(exp.ToString());
}

try
{
    // converts from string to byte[]
     System.Text.ASCIIEncoding enc = new System.Text.ASCIIEncoding();
     byte[] msg = new byte[1500];
     msg = enc.GetBytes(textMessage.Text);
     // sending the message
     sck.Send(msg);
     // add to listbox
     listMessage.Items.Add("You: " + textMessage.Text);
     // clear txtMessage
     textMessage.Clear();
}
catch (Exception ex)
{
    MessageBox.Show(ex.ToString());
}
