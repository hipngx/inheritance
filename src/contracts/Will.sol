//pragma solidity ^0.5.7;
pragma solidity ^0.5.17;

contract Will {
    address public owner; //tạo biến
    uint public fortune;
    bool deceased;
    //tạo constructor
    // hàm khởi tạo
    constructor() payable public { //payable cho phép F gửi và nhận ether(special)
        owner = msg.sender;  // đại diện cho địa chỉ được gọi tới để thực thi hợp đồng
        fortune = msg.value; //thông báo ta biết bao nhiêu ether được gửi
        deceased =false; // granba vẫn chua die
    }

    //modifiers in solidity
    //tạo modifier để người cos thể gọi tới hợp đồng này chỉ là chủ sở hữu
    modifier onlyOwner{
        require(msg.sender==owner); //bắt buộc message center phải bằng owner/ require như câu điều kiện
        _;//bảo hàm tiếp tục, như hàm next();

    }
    //tạo modifier so that we only allocate funds if frieand's gramp deceased
      modifier mustBeDeceased{
        require(deceased==true);
        _;
    }

    // tạo list để lưu trữ các địa chỉ của những người thừa kế ethereum
    address payable[] familyWallets;// để danh sách này có thể payable 
        //map through inherritance
    mapping(address=>uint) inheritance ;// khai báo biến inheritance dạng map/ key store value
        //set inheritance cho mỗi địa chỉ address
    function setInheritance(address payable wallet, uint amount) public {
        // add wallet to family
        familyWallets.push(wallet);
        inheritance[wallet] = amount;
    }
    //pay each family member dựa vào cái danh sách ví đã lưu
    function payout() private mustBeDeceased {
        for(uint i=0;i<familyWallets.length;i++) {
            familyWallets[i].transfer(inheritance[familyWallets[i]]);
            //transfering the fund from contract address to recive address
        }
    }
    //oracle simulated switch
    function hasDeceased() public onlyOwner {
        deceased = true;
        payout();
    }

    function isOwner(address check) public returns (bool success) {
        if(check==owner)
        return true;
        return false;
    }
}