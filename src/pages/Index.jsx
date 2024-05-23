import React, { useState, useEffect } from 'react';
import { Box, Flex, Input, useToast } from '@chakra-ui/react';
import { create } from '../../lib/openai';

const Index = () => {
  const [inputValue, setInputValue] = useState('');
  const [iframeContent, setIframeContent] = useState('');
  const toast = useToast();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      toast({
        title: 'Input submitted.',
        description: `You entered: ${inputValue}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      try {
        const response = await create({
          messages: [
            { role: 'system', content: 'Generate JS and HTML that fully works.' },
            { role: 'user', content: inputValue }
          ],
          model: 'gpt-4',
        });

        const generatedContent = response.choices[0].message.content;
        const codeMatch = generatedContent.match(/```(?:javascript|html)?\n([\s\S]*?)```/);

        if (codeMatch) {
          setIframeContent(codeMatch[1]);
        } else {
          setIframeContent('No valid code block found in the response.');
        }
      } catch (error) {
        console.error('Error generating content:', error);
        toast({
          title: 'Error',
          description: 'There was an error generating the content.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      setInputValue('');
    }
  };

  return (
    <Flex height="100vh" direction={{ base: 'column', md: 'row' }}>
      <Box width={{ base: '100%', md: '25%' }} p={4} borderRight={{ base: 'none', md: '1px solid #ccc' }}>
        <Input
          placeholder="Type your message here..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          height="200px"
        />
      </Box>
      <Box width={{ base: '100%', md: '75%' }} p={4}>
        <iframe
          title="Output"
          style={{ width: '100%', height: '100%', border: 'none' }}
          srcDoc={iframeContent}
        />
      </Box>
    </Flex>
  );
};

export default Index;