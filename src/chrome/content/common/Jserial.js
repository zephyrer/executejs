/* DotNetRemoting JavaScript Serializer/Deserializer
 * Orignial Author Dan Wellmann Thanks!!!
 * Downloaded from http://dotnetremoting.com/  
 * */

(function(){
	
      // main entry for serialization  
      // JavaScript object as an input
      // usage: JSerialize(MyObject);
      // other parameters objectName, indentSpace may be omitted
      function JSerialize(ObjectToSerilize, objectName, indentSpace, ommitFunctions)
      {
         indentSpace = indentSpace?indentSpace:'';
         
         var Type = GetTypeName(ObjectToSerilize);
         
         if((Type=="Function" && ommitFunctions) || objectName=="prototype"){
         	return ""
         }
          
         var s = indentSpace  + '<' + objectName +  ' type="' + Type + '">';
         
         switch(Type)
         {
      		case "number":
      		case "string":
      		case "boolean":		
      		{
      			s += ObjectToSerilize; 
      		} 
         
      		break;
      	   
      	   case "date":
      	   {
      			s += ObjectToSerilize.toLocaleString(); 
      	   }
      	   break;
      	   
      		case "array":
      		{
      			s += "\n";
      				
      				for(var name in ObjectToSerilize)
      				{
      					s += JSerialize(ObjectToSerilize[name], ('index' + name ), indentSpace + "   ", ommitFunctions);
      				};
      				
      				s += indentSpace;
      		}
      		break;
         	 		
      		default:
      		{
      			s += "\n";
      			
      			for(var name in ObjectToSerilize)
      			{
      				s += JSerialize(ObjectToSerilize[name], name, indentSpace + "   ", ommitFunctions);
      			};
      			
      			s += indentSpace;
      		}
      		break;
      
         }
         
      	s += "</" + objectName + ">\n";	
           
          return s;
      };
      
      // main entry for deserialization
      // XML string as an input
      function JDeserialize(XmlText)
      {
      	var _doc = GetDom(XmlText); 
      	return Deserial(_doc.childNodes[0]);
      }
      
      // get dom object . IE or Mozilla
      function GetDom(strXml)
      {
      	var parser = new DOMParser();
      	return parser.parseFromString(strXml, "text/xml");
      }
      
      // internal deserialization
      function Deserial(xn)
      {
      	var RetObj; 
      	 
      	var NodeType = "object";
      	
      	if (xn.attributes != null && xn.attributes.length != 0)
      	{
      		var tmp = xn.attributes.getNamedItem("type");
      		if (tmp != null)
      		{
      			NodeType = xn.attributes.getNamedItem("type").nodeValue;
      		}
      	}
      	
      	if (IsSimpleVar(NodeType))
      	{
      		return StringToObject(xn.textContent, NodeType);
      	}
      	
      	switch(NodeType)
      	{
      		case "array":
      		{
      			RetObj = [];
      			var arrayIndex = 0
      			for(var i = 0; i < xn.childNodes.length; i++)
      			{
      				var node = xn.childNodes[i];
      				if(node.nodeType!=1){
      					continue
      				}
      				RetObj[arrayIndex++] = Deserial(node);
      			}
      			
      			return RetObj;
      		}
      		
      		case "object":
      		default:
      		{
      			try
      			{
      				RetObj = eval("new "+ NodeType + "()");
      			}
      			catch(e)
      			{
      				// create generic class
      				RetObj = new Object();
      			}
      		}
      		break;
      	}
      	
      	for(var i = 0; i < xn.childNodes.length; i++)
      	{
      		var node = xn.childNodes[i];
      		if(node.nodeType!=1){
      			continue
      		}
      		RetObj[node.nodeName] = Deserial(node);
      	}
      
      	return RetObj;
      }
      
      function IsSimpleVar(type)
      {
      	switch(type)
      	{
      		case "int":
      		case "string":
      		case "String":
      		case "Number":
      		case "number":
      		case "Boolean":
      		case "boolean":
      		case "bool":
      		case "dateTime":
      		case "Date":
      		case "date":
      		case "float":
      			return true;
      	}
      	
      	return false;
      }
      
      function StringToObject(Text, Type)
      {
      	var RetObj = null;
      
      	switch(Type)
      	{
      		case "int":
      			return parseInt(Text);   
      			 
      		case "number":
      		{
      			var outNum;
      			
      			if (Text.indexOf(".") > 0)
      			{
      				return parseFloat(Text);    
      			}
      			else
      			{
      				return parseInt(Text);    
      			}
       		}	
      			 	 
      		case "string":
      		case "String":
      			return Text;
      			 
      		case "dateTime":
      		case "date":
      		case "Date":
      			return new Date(Text);
      		 		
      		case "float":
      			return parseFloat(Text, 10);
      			
      		case "bool":
      			{
      				if (Text == "true" || Text == "True")
      				{
      					return true;
      				}
      				else
      				{
      					return false;
      				}
      			}
      			return parseBool(Text);	
      	}
      
      	return RetObj;  
      }
      
      function GetClassName(obj) 
      {	 
      	try
      	{
      		var ClassName = obj.constructor.toString();
      		ClassName = ClassName.substring(ClassName.indexOf("function") + 8, ClassName.indexOf('(')).replace(/ /g,'');
      		return ClassName;
      	}
      	catch(e) 
      	{
      		return "NULL";
      	}
      }
       
      function GetTypeName(ObjectToSerilize)
      {
      	if (ObjectToSerilize instanceof Array)
      		return "array";
      		
      	if (ObjectToSerilize instanceof Date)
      		return "date";	
      		
      	var Type  = typeof(ObjectToSerilize);
      
      	if (IsSimpleVar(Type))
      	{
      		return Type;
      	}
      	
      	Type = GetClassName(ObjectToSerilize); 
      	
      	return Type;
      }

   DE_MOUSELESS_EXTENSION_NS["JSerialize"] = JSerialize;
   DE_MOUSELESS_EXTENSION_NS["JDeserialize"] = JDeserialize;
})()